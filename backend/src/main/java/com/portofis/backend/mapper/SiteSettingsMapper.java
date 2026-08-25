package com.portofis.backend.mapper;

import com.portofis.backend.dto.settings.SiteSettingsDto;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Flattens the site_settings key/value rows into the fixed-shape SiteSettingsDto
 * and back, per docs/API_CONTRACT.md §8 / docs/DATABASE_SCHEMA.md §5.
 */
@Component
public class SiteSettingsMapper {

    public static final String SITE_NAME = "site_name";
    public static final String PHONE = "phone";
    public static final String ADDRESS = "address";
    public static final String WEBSITE_URL = "website_url";
    public static final String WHATSAPP_NUMBER = "whatsapp_number";
    public static final String INSTAGRAM_URL = "instagram_url";
    public static final String FACEBOOK_URL = "facebook_url";
    public static final String WORKING_HOURS = "working_hours";
    public static final String MAP_EMBED_URL = "map_embed_url";
    public static final String FOOTER_NOTE = "footer_note";

    public static final List<String> ALL_KEYS = List.of(
            SITE_NAME, PHONE, ADDRESS, WEBSITE_URL, WHATSAPP_NUMBER,
            INSTAGRAM_URL, FACEBOOK_URL, WORKING_HOURS, MAP_EMBED_URL, FOOTER_NOTE
    );

    public SiteSettingsDto toDto(Map<String, String> values) {
        return new SiteSettingsDto(
                orEmpty(values.get(SITE_NAME)),
                orEmpty(values.get(PHONE)),
                orEmpty(values.get(ADDRESS)),
                orEmpty(values.get(WEBSITE_URL)),
                orEmpty(values.get(WHATSAPP_NUMBER)),
                orEmpty(values.get(INSTAGRAM_URL)),
                orEmpty(values.get(FACEBOOK_URL)),
                orEmpty(values.get(WORKING_HOURS)),
                orEmpty(values.get(MAP_EMBED_URL)),
                orEmpty(values.get(FOOTER_NOTE))
        );
    }

    public Map<String, String> toKeyValueMap(SiteSettingsDto dto) {
        Map<String, String> map = new LinkedHashMap<>();
        map.put(SITE_NAME, orEmpty(dto.siteName()));
        map.put(PHONE, orEmpty(dto.phone()));
        map.put(ADDRESS, orEmpty(dto.address()));
        map.put(WEBSITE_URL, orEmpty(dto.websiteUrl()));
        map.put(WHATSAPP_NUMBER, orEmpty(dto.whatsappNumber()));
        map.put(INSTAGRAM_URL, orEmpty(dto.instagramUrl()));
        map.put(FACEBOOK_URL, orEmpty(dto.facebookUrl()));
        map.put(WORKING_HOURS, orEmpty(dto.workingHours()));
        map.put(MAP_EMBED_URL, orEmpty(dto.mapEmbedUrl()));
        map.put(FOOTER_NOTE, orEmpty(dto.footerNote()));
        return map;
    }

    private String orEmpty(String value) {
        return value == null ? "" : value;
    }
}
