/* prefs.js
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */


const {
    Adw,
    GObject,
    Gtk
} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


const _ = ExtensionUtils.gettext;


class KeyringAutolockPreferences extends Adw.PreferencesPage {

    static {
        GObject.registerClass(this);
    }


    #settings;
    #check_spin;
    #lock_spin;


    constructor()
    {
        super({
            title: _('General settings')
        });

        this.#settings = ExtensionUtils.getSettings();


        let timer_group = new Adw.PreferencesGroup({
            title: _('Timers')
        });
        this.add(timer_group);


        let check_row = new Adw.ActionRow({
            title: _('Check interval (seconds)'),
            tooltip_text: _('The keyring is checked periodically, to detect if it is unlocked.'),
        });
        timer_group.add(check_row);

        this.#check_spin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 1,
                upper: 3600,
                page_increment: 60,
                step_increment: 15,
            }),
            value: this.#settings.get_uint('check-interval'),
            width_chars: 6
        });
        check_row.add_suffix(this.#check_spin);
        this.#check_spin.connect('value-changed',
                                 spin => this.#settings.set_uint('check-interval', spin.value));

        let lock_row = new Adw.ActionRow({
            title: _('Lock delay (seconds)'),
            tooltip_text: _('How long the keyring is allowed to stay unlocked.'),
        });
        timer_group.add(lock_row);

        this.#lock_spin = new Gtk.SpinButton({
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 86400,
                page_increment: 300,
                step_increment: 60,
            }),
            value: this.#settings.get_uint('lock-delay'),
            width_chars: 6
        });
        lock_row.add_suffix(this.#lock_spin);
        this.#lock_spin.connect('value-changed',
                                spin => this.#settings.set_uint('lock-delay', spin.value));

    }

};


function buildPrefsWidget()
{
    return new KeyringAutolockPreferences();
}


function init(meta)
{
    ExtensionUtils.initTranslations();
}